// import { DiscordRequest, getRandomEmoji } from "./utils.js";
// import { InteractionResponseType, InteractionType } from "discord-interactions";

// export async function POST(req: any) {
//   // Interaction type and data
//   const { type, id, data } = req.body;

//   /**
//    * Handle verification requests
//    */
//   if (type === InteractionType.PING) {
//     return new Response(JSON.stringify({ type: InteractionResponseType.PONG }));
//   }

//   /**
//    * Handle slash command requests
//    * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
//    */
//   if (type === InteractionType.APPLICATION_COMMAND) {
//     const { name } = data;

//     // "test" command
//     if (name === "test") {
//       // Send a message into the channel where command was triggered from
//       return new Response(
//         JSON.stringify({
//           type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//           data: {
//             // Fetches a random emoji to send from a helper function
//             content: "hello world " + getRandomEmoji(),
//           },
//         }),
//       );
//     }

//     if (name === "send" && id) {
//       const userId = req.body.member.user.id;
//       const inputValues = req.body.data.options;
//       const ipfsHash = inputValues[0].value;
//       const receiverAddress = inputValues[1].value;
//       const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}`;

//       res.send({
//         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
//         data: {
//           content: `Received relay request from <@${userId}>`,
//         },
//       });

//       try {
//         const resp = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`, {
//           method: "GET",
//           headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers": "*",
//             "Content-Type": "application/json",
//           },
//         });

//         const proofData = await resp.json();
//         proofData["receiverAddress"] = receiverAddress;
//         console.log(proofData);

//         const txResp = await fetch(`/api/discordbot`, {
//           method: "POST",
//           headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers": "*",
//             "Content-Type": "application/json",
//           },

//           body: JSON.stringify(proofData),
//         });

//         const txData = await txResp.json();
//         console.log(txData.transaction);

//         await DiscordRequest(endpoint, {
//           method: "POST",
//           body: {
//             content: `Relayed transaction for <@${userId}>! Tx Hash = ${txData.transaction}`,
//           },
//         });
//       } catch (e) {
//         console.log(e);
//         await DiscordRequest(endpoint, {
//           method: "POST",
//           body: {
//             content: `Failed to relay transaction for <@${userId}>! Please check inputs or contact support.`,
//           },
//         });
//       }
//     }
//   }
// }
