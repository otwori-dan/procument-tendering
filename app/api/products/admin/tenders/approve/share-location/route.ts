import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: Request, res: Response) {

  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
;
    
    const { applicationId,
        longitude,
        latitude,
        applicantId
    } = await req.json();
    console.log("applicationId", applicationId, "longitude", longitude, "latitude", latitude, "applicantId", applicantId);  


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

  const applicant = await prisma.applicant.findUnique({
        where: {
            id: applicantId
            }
            
        });

    if(!applicant){
        return  NextResponse.json({ message: "Applicant not found",
        status: 404
        });

    }

    //update application longitude and latitude with the new values with respect to the applicant
    const updatedApplication = await prisma.application.update({
        where: {
            id: applicationId
        },
        data: {
            longitude: longitude,
            latitude: latitude
        },
        include: {
            applicant: true,
            tender: true
        }
    });

  
    //return updated application
    return  NextResponse.json({ message: `Your tender (${updatedApplication.tender.name}) 
    application has been updated with your location`,
    status: 200,
    data: updatedApplication
    });
  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}