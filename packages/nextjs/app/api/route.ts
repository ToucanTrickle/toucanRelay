import pinataSDK from "@pinata/sdk";

// import formidable from "formidable";
// import { IncomingMessage } from "http";

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

const saveFile = async (data: any) => {
  try {
    const options = {
      pinataMetadata: {
        name: "relayAsk",
      },
    };
    console.log(data);
    const response = await pinata.pinJSONToIPFS(data, options);

    return response;
  } catch (error) {
    throw error;
  }
};

export async function GET() {
  try {
    const response = await pinata.pinList({
      pageLimit: 1,
    });
    return new Response(JSON.stringify({ data: response }));
  } catch (e) {
    return new Response("Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const response = await saveFile(await req.json());
    const { IpfsHash } = response;

    return new Response(JSON.stringify({ IpfsHash: IpfsHash }));
  } catch (e) {
    return new Response("Server Error", { status: 500 });
  }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     try {
//       const response = await saveFile(req.body);
//       const { IpfsHash } = response;

//       return res.send(IpfsHash);
//     } catch (e) {
//       console.log(e);
//       res.status(500).send("Server Error");
//     }
//   } else if (req.method === "GET") {
//     try {
//       // const response = await pinata.pinList({
//       //   pageLimit: 1,
//       // });
//       // res.json(response.rows[0]);
//       res.json({ hello: "world" });
//     } catch (e) {
//       console.log(e);
//       res.status(500).send("Server Error");
//     }
//   }
// }
