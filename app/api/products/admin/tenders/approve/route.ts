import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: Request, res: Response) {

  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    // console.log("req.body", await req.json());
    
    const { applicationId } = await req.json();
    console.log("applicationId", applicationId);

    const application = await prisma.application.findUnique({
        where: {
            id: applicationId
            }
            
        });

    if(!application){
        return  NextResponse.json({ message: "Application not found",
        status: 404
        });

    }

   
 //approve application
    const updatedApplication = await prisma.application.update({
        where: {
            id: applicationId
        },
        data: {
            status: "approved"
        }
    });

    //return updated application
    return  NextResponse.json({ message: "Application approved successfully",
    status: 200,
    data: updatedApplication
    });
  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}