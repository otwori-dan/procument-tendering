import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
// import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import bcrypt from "bcryptjs"; // Import for password hashing
const prisma = new PrismaClient();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request, res: Response) {

  // if(!process.env.SENDGRID_API_KEY) {
  //   console.log("SENDGRID_API_KEY is not set");
    
  //   return  NextResponse.json({ message: "Invalid request", 
  //   status: 400
  //  });
  // }
  try {
    if (!req.body) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    const  { email, password } = await req.json(); 

    console.log(email, password);
    

    // Validate email existence
    const existingUser = await prisma.applicant.findUnique({
      where: { email },
    });
    if (existingUser) {
      // return new NextResponse("Email already exists", { status: 400 });
      return  NextResponse.json({ message: "Email already exists", 
       status: 400
      }); 
    }

    // (Implement password validation rules here)
     if (password.length < 8) {
      return NextResponse.json({ message: "Password is too short", 
        status: 400
       });
       
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
     await prisma.applicant.create({
      data: {
        email: email,
        username: email,
        password: hashedPassword,
        verificationToken: token,
        isVerified: false,
        profile_pic: 'https://res.cloudinary.com/dzvtkbjhc/image/upload/v1704196342/francc_ymmkkz.png'
        
      }
    });

    // Send verification email
    // const mail = {
    //     to: email,
    //     subject: 'Verification Email',
    //     from: 'francismwanik254@gmail.com', // Fill it with your validated email on SendGrid account
    //     dynamicTemplateData: {
    //      token: token,
    //     email: email,
    //     },
    //     templateId: 'd-a2052d8d073c486e84bea5841d8f2888',
    //   };
        try {
          // await sgMail.send(mail);
        } catch (error: any) {
          console.error(error);
          if (error.message) {
            console.log(error.message);
            
            return  NextResponse.json({ message: error.message,
              status: 500
             });
          }

          
        }

        //User created successfully and verification email sent to ${email}
        return  NextResponse.json({ message: "ok", 
       status: 201
      });


  } catch (error: any) {
    return  NextResponse.json({ message: error.message, 
       status: 500
      });
  }
}
