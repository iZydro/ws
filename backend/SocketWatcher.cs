using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;

namespace EchoApp
{
    public class ZydroSocket
    {
        public WebSocket WebSocket;
        public string username;
    }
    
    public static class SocketWatcher
    {
        private static readonly List<ZydroSocket> ConnectedSockets = new List<ZydroSocket>();
        
        public static void Add(WebSocket socket, string name)
        {
            ConnectedSockets.Add(new ZydroSocket
            {
                WebSocket = socket,
                username = name
            });
        }

        public static void Delete(WebSocket socket)
        {
            ConnectedSockets.Remove(ConnectedSockets.Find((s) => s.WebSocket == socket));
        }

        public static string ListAll()
        {
            var result = "";
            foreach (var socket in ConnectedSockets)
            {
                result += socket.WebSocket.State;
                result += ": ";
                result += socket.username;
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
                    var result = Encoding.ASCII.GetBytes("Heartbeat " + cnt);
                    await socket.WebSocket.SendAsync(
                        new ArraySegment<byte>(result, 0, result.Length),
                        WebSocketMessageType.Text,
                        true,
                        CancellationToken.None
                    );
                }

                cnt++;
            }
        }

        public static async Task SendAll(WebSocketReceiveResult result, byte[] buffer)
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