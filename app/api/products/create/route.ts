import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/* 

id: string;
  name: string;
  postBy: string;
  postDate: string;
  expiryDate: string;
  description: string;
  adminId: string;
  createdAt: string;
  updatedAt: string;
  OpeningVenue : string;
  ClosingTime: string;
  PublicLink: string;
  DaysToClose: number;
  OCID : string;
  procurementMethod: string;
  FinancialYear: string;
*/

export async function POST(req: Request, res: Response) {

  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    const  {  
        name,
        description,
        postBy,
        postDate,
        expiryDate,
        adminId,
        OpeningVenue,
        ClosingTime,
        PublicLink,
        DaysToClose,
        OCID,
        procurementMethod,
        FinancialYear,
        subModules

    } = await req.json(); 



console.log(name, description, postBy, postDate, expiryDate, adminId, OpeningVenue, ClosingTime, PublicLink, DaysToClose, OCID, procurementMethod, FinancialYear, subModules);
    // if (!name || !description || !postBy || !postDate || !expiryDate || !adminId || !OpeningVenue || !ClosingTime || !PublicLink || !DaysToClose || !OCID || !procurementMethod || !FinancialYear ) {
    //   return  NextResponse.json({ message: "All fields are required",
    //    status: 400
    //   });
    // }

    
    


    

    // Validate email existence
    const existingUser = await prisma.admin.findUnique({
      where: {
        id: adminId,
      }
    });
    if (!existingUser) {
      return  NextResponse.json({ message: "No such admin",
       status: 400
      }); 
    }
      // create tender
     await prisma.tender.create({
        data: {
            name,
            description,
            postBy,
            postDate,
            expiryDate,
            adminId,
            OpeningVenue,
            ClosingTime,
            PublicLink,
            DaysToClose : String(new Date().getTime() + DaysToClose * 24 * 60 * 60 * 1000),
            OCID,
            procurementMethod,
            FinancialYear,
            subModules: subModules,

        },
        });



        
        console.log("Tender created successfully");
        
        return  NextResponse.json({ message: "Tender created successfully",
       status: 201
      });


  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}
