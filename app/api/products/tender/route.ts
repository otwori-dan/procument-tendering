import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: Request, res: Response) {
    if (!req.body) {
        return new NextResponse("Invalid request", { status: 400 });
      }
      const  {  
          tenderId,
      } = await req.json(); 
  
  try {

    if (!tenderId) {
        return  NextResponse.json({ message: "All fields are required",
            status: 400
            });

    }
    // find tender
    const tender = await prisma.tender.findUnique({
        where: {
          id: tenderId,
        },
      });

    if (!tender) {
        return  NextResponse.json({ message: "No such tender",
            status: 400
            });
    }
    // delete tender


        
        return  NextResponse.json (tender, {
       status: 200
      });


  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}
