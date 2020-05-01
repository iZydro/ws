using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;

namespace EchoApp
{
    public static class SocketWatcher
    {
        public static List<WebSocket> ConnectedSockets = new List<WebSocket>();
        
        public static void Add(WebSocket socket)
        {
            ConnectedSockets.Add(socket);
        }

        public static void Delete(WebSocket socket)
        {
            ConnectedSockets.Remove(socket);
        }

        public static string ListAll()
        {
            string result = String.Empty;
            foreach (var socket in ConnectedSockets)
            {
                result += socket.State;
                result += "\n";
            }

            return result;
        }

        public static async Task Run()
        {
            var cnt = 0;
            while (true)
            {
                await Task.Delay(5000);
                foreach (var socket in ConnectedSockets)
                {
                    var result = Encoding.ASCII.GetBytes("Cagamandurrio " + cnt);
                    await socket.SendAsync(new ArraySegment<byte>(result, 0, result.Length), WebSocketMessageType.Text,
                        true, CancellationToken.None);
                }

                cnt++;
            }
        }

        public static async Task SendAll(WebSocketReceiveResult result, byte[] buffer)
        {
            foreach (var socket in ConnectedSockets)
            {
                await socket.SendAsync(
                    new ArraySegment<byte>(buffer, 0, result.Count),
                    result.MessageType,
                    result.EndOfMessage,
                    CancellationToken.None
                );
            }
        }

    }
}