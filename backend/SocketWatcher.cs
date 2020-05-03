using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace EchoApp
{
    public class ZydroSocket
    {
        public WebSocket WebSocket;
        public string Username;
        public long Points;
        public string Play = "";
    }

    public static class SocketWatcher
    {
        public static readonly List<ZydroSocket> ConnectedSockets = new List<ZydroSocket>();

        public static void Add(WebSocket socket, string name)
        {
            ConnectedSockets.Add(new ZydroSocket
            {
                WebSocket = socket,
                Username = name,
            });
        }

        public static void Delete(WebSocket socket)
        {
            ConnectedSockets.Remove(ConnectedSockets.Find((s) => s.WebSocket == socket));
        }

        public static void Play(WebSocket socket, string play)
        {
            // return;

            var zs = ConnectedSockets.Find(s => s.WebSocket == socket);
            if (zs == null)
            {
                Console.WriteLine("Socket does not exist!");
                return;
            }

            zs.Play = play;
        }

        public static string ListAll()
        {
            var result = "";
            foreach (var socket in ConnectedSockets)
            {
                result += socket.WebSocket.State;
                result += ": ";
                result += socket.Username;
                result += "(";
                result += socket.Points;
                result += ") ";
                result += socket.Play;
                result += "\n";
            }

            return result;
        }

        public static async Task SendResultsAll()
        {
            var listResults = new List<Dictionary<string, string>>();
            foreach (var zs in ConnectedSockets)
            {
                listResults.Add(new Dictionary<string, string>
                {
                    {"username", zs.Username},
                    {"play", zs.Play}
                });
            }

            var jsonSend = new Dictionary<string, List<Dictionary<string, string>>>
            {
                { "results", listResults }
            };
            string toSend = JsonConvert.SerializeObject(jsonSend);

            Console.WriteLine("Sending results: " + toSend);
            await SendStringAll(toSend);
        }

        private static async Task SendAll(string type, string message)
        {
            var jsonSend = new Dictionary<string, string>
            {
                {type, message}
            };
            string toSend = JsonConvert.SerializeObject(jsonSend);

            await SendStringAll(toSend);
        }

        private static async Task SendStringAll(string toSend)
        {
            foreach (var socket in ConnectedSockets)
            {
                if (socket.WebSocket.State == WebSocketState.Open)
                {
                    var result = Encoding.ASCII.GetBytes(toSend);
                    await socket.WebSocket.SendAsync(
                        new ArraySegment<byte>(result, 0, result.Length),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None
                    );
                }
            }
        }
        
        public static async Task Run()
        {
            var cnt = 0;
            const int COUNT_TIME = 500;
            while (true)
            {
                await Task.Delay(COUNT_TIME);
                await SendAll("info", "1");
                await Task.Delay(COUNT_TIME);
                await SendAll("info", "2");
                await Task.Delay(COUNT_TIME);
                await SendAll("info", "3");
                await Task.Delay(COUNT_TIME);
                await SendAll("info", "piedra");
                await Task.Delay(COUNT_TIME);
                await SendAll("info", "papel");
                await Task.Delay(COUNT_TIME);
                await SendAll("info", "tijeras");
                await Task.Delay(2000);
                Winners.ComputeWinners();
                await SendAll("info", "Pollo: " + cnt);
                cnt++;
            }
        }

        public static async Task SendMessageAll(WebSocketReceiveResult result, byte[] buffer)
        {
            foreach (var socket in ConnectedSockets)
            {
                await socket.WebSocket.SendAsync(
                    new ArraySegment<byte>(buffer, 0, result.Count),
                    result.MessageType,
                    result.EndOfMessage,
                    CancellationToken.None
                );
            }
        }

    }
}