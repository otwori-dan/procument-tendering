import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function GET(req: Request, res: Response) {

  try {
    const tenders = await prisma.tender.findMany()
    const openingVenues = tenders.map(tender => tender.OpeningVenue?.toString() || "N/A");

  if(openingVenues.length > 0) {

    console.log("openingVenues",openingVenues);

  //  console.log("tenders",tenders);

   if (!tenders) {
      return  NextResponse.json({ message: "No tenders found",

        status: 404
      });
    }


        
        return  NextResponse.json (tenders, {
       status: 200
      });

  }

  return  NextResponse.json({ message: "No tenders found",

        status: 404
      });

   
      
  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}
