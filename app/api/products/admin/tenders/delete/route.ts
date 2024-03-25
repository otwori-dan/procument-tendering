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

   
    //delete application
    const deletedApplication = await prisma.application.delete({
        where: {
            id: applicationId
        }
    });

    //return deleted application
    return  NextResponse.json({ message: "Application deleted successfully",
    status: 200,
    data: deletedApplication
    });

  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}