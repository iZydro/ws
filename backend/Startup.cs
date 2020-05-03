#define UseOptions // or NoOptions
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace EchoApp
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddRouting();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

#if NoOptions
            app.UseWebSockets();
#endif

#if UseOptions
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
                ReceiveBufferSize = 4 * 1024
            };
            app.UseWebSockets(webSocketOptions);
#endif

            app.UseCors(builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                // .AllowCredentials()
            );

            app.UseRouting();

            app.UseFileServer();

            Task.Run(() => SocketWatcher.Run());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/status", async (context) =>
                {
                    await context.Response.WriteAsync(SocketWatcher.ListAll());
                });

                endpoints.MapGet("/ws/{name}", async (context) =>
                {
                    if (context.WebSockets.IsWebSocketRequest)
                    {
                        WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                        var name = context.GetRouteValue("name");
                        SocketWatcher.Add(webSocket, name.ToString());
                        await Echo(context, webSocket);
                    }
                    else
                    {
                        context.Response.StatusCode = 400;
                    }
                });
            });

        }

        private async Task Loop(HttpContext context, WebSocket webSocket)
        {
            var cnt = 0;
            while (true)
            {
                await Task.Delay(4000);
                var result = Encoding.ASCII.GetBytes("Loop " + cnt++);;
                await webSocket.SendAsync(new ArraySegment<byte>(result, 0, result.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }

        private async Task Echo(HttpContext context, WebSocket webSocket)
        {
            Task.Run(() => Loop(context, webSocket));

            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            while (!result.CloseStatus.HasValue)
            {
                Console.WriteLine("Received");
                var resultString = Encoding.UTF8.GetString(buffer, 0, result.Count);
                Console.WriteLine(resultString);

                var resultJson = JsonConvert.DeserializeObject<Dictionary<string, string>>(resultString);
                var name = resultJson["name"];
                if (resultJson.ContainsKey("play"))
                {
                    // User plays
                    SocketWatcher.Play(webSocket, resultJson["play"]);
                }

                await SocketWatcher.SendAll(result, buffer);

                // Keep reading
                result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            }
            Console.WriteLine("Socket closing!");
            SocketWatcher.Delete(webSocket);
            await webSocket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
        }
    }
}
