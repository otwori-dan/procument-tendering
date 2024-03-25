import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: Request, res: Response) {

  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    // console.log("req.body", await req.json());
    
    const { adminId } = await req.json();
    console.log("adminId", adminId);

    const admin = await prisma.admin.findUnique({
        where: {
            id: adminId
            }
            
        });

    if(!admin){
        return  NextResponse.json({ message: "Admin not found",
        status: 404
        });

    }

    //get all applications
    const applications = await prisma.application.findMany({
        include: {
            applicant: true,
            tender: true    
        }
        });
        
        // console.log("applications", applications);
        



    

        //return all applications
        return  NextResponse.json({ message: "Applications retrieved successfully",
        status: 200,
        data: applications
        });


  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}