using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace EchoApp
{
    public static class Winners
    {
        public static void ComputeWinners()
        {
            foreach (var users in SocketWatcher.ConnectedSockets)
            {
                var points = 0;
                var me = users.WebSocket;
                var mine = users.Play;

                // Check others
                foreach (var socket in SocketWatcher.ConnectedSockets)
                {
                    if (socket.WebSocket != me)
                    {
                        var their = socket.Play;
                        switch (mine)
                        {
                            case "":
                                break;
                            case "piedra":
                                if (their == "papel") points -= 1;
                                if (their == "tijeras") points += 1;
                                break;
                            case "papel":
                                if (their == "tijeras") points -= 1;
                                if (their == "piedra") points += 1;
                                break;
                            case "tijeras":
                                if (their == "piedra") points -= 1;
                                if (their == "papel") points += 1;
                                break;
                        }
                    }
                }
                users.Points += points;
            }
        }
    }
}