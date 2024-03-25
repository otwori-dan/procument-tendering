import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function GET(req: Request, res: Response) {

  try {
 
    //get all applications
    const applications = await prisma.application.findMany({
      include:{
        applicant : true,
        tender:true
      }
    });

    // console.log("applications", applications);
    
    return  NextResponse.json({ message:"Success",
    status: 200,
    data: applications
    });



  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}