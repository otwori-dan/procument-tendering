import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: Request, res: Response) {

  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    // console.log("req.body", await req.json());
    
    const { tenderId } = await req.json();
    console.log("tenderId", tenderId);

    const tender = await prisma.tender.findUnique({
        where: {
            id: tenderId
            }
            
        });

    if(!tender){
        return  NextResponse.json({ message: "Tender not found",
        status: 404
        });

    }

   
    //delete tender
    const deletedTender = await prisma.tender.delete({
        where: {
            id: tenderId
        }
    });
    //return deleted application
    return  NextResponse.json({ message: "Tender deleted successfully",
    status: 200,
    data: deletedTender
    });

  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}