using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace EchoApp
{
    public static class SocketWatcher
    {
        public static async Task Run()
        {
            var cnt = 0;
            while (true)
            {
                await Task.Delay(5000);
                foreach (var socket in Startup.ConnectedSockets)
                {
                    var result = Encoding.ASCII.GetBytes("Cagamandurrio " + cnt++);
                    await socket.SendAsync(new ArraySegment<byte>(result, 0, result.Length), WebSocketMessageType.Text,
                        true, CancellationToken.None);
                }
            }
        }

        public static async Task SendAll(WebSocketReceiveResult result, byte[] buffer)
        {
            foreach (var socket in Startup.ConnectedSockets)
            {
                await socket.SendAsync(
                    new ArraySegment<byte>(buffer, 0, result.Count),
                    result.MessageType,
                    result.EndOfMessage,
                    CancellationToken.None
                );
            }
        }

        public static string ListAll()
        {
            string result = String.Empty;
            foreach (var socket in Startup.ConnectedSockets)
            {
                result += socket.State;
                result += " - ";
            }

            return result;
        }
    }
}