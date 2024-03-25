import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: Request, res: Response) {

  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    // console.log("req.body", await req.json());
    
    const { applicantId } = await req.json();
    console.log("applicantId", applicantId);

    const applicant = await prisma.applicant.findUnique({
        where: {
            id: applicantId
            },
            select:{
                applications: true,
                username: true
            }
        });

    if(!applicant){
        return  NextResponse.json({ message: "Applicant not found",
        status: 404
        });
    }


    

        //return all applications
        return  NextResponse.json({ message: "Applications retrieved successfully",
        status: 200,
        data: applicant.applications
        });


  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}