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
    // console.log("tenderId----------------------", tenderId);

    //fetch all applications where tenderId is equal to tenderId
    const tender = await prisma.application.findUnique({
        where: {
            id: tenderId
            },
            select:{
                tender: {
                    select:{
                        id: true
                    }
                
                }
            }
            
        });

        console.log("----------------------tender----------------", tender?.tender.id);
        
    if(tender){
        const updatedApplication = await prisma.tender.update({
            where:{
                id: tender.tender.id
            },
            data:{
                applications:{
                    update:{
                        where:{
                            id: tenderId
                        },
                        data:{
                            isDelivered: true
                        }
                    }
                
                }
            },
            select:{
                applications:{
                    select:{
                        isDelivered: true
                    }
                }
            }
          

            }
        );

        //return updated application
        return  NextResponse.json({ message: "Delivery status updated successfully",
        status: 200,
        data: updatedApplication
        });

    }

    

    return  NextResponse.json({ message: "Application not found",
        status: 404
        });

  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}