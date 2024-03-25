// initiatePasswordReset.ts

import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
// import sgMail from "@sendgrid/mail";
const prisma = new PrismaClient();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request, res: Response) {
  try {
    if (req.method !== "POST") {
      // return new NextResponse("Method Not Allowed", { status: 405 });
      return NextResponse.json({ message: "Method Not Allowed", 
      status: 405
     });
    }

    const { email } = await req.json(); // Assuming only email is sent in the request body
    if (!email) {
      // return new NextResponse("Invalid request", { status: 400 });
      return NextResponse.json({ message: "Invalid request",
        status: 400
        });
    }

    // Find user by email
    const user = await prisma.applicant.findUnique({
      where: { email },
    });

    if (!user) {
      // return new NextResponse("User not found", { status: 404 });
      return NextResponse.json({ message: "User not found",
        status: 404
        });
    }

    // Generate a unique reset token
    const resetToken = randomBytes(32).toString("hex");

    // Update user's reset token in the database
    await prisma.applicant.update({
      where: { id: user.id },
      data: { resetToken: resetToken,
       resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
     },
    });

    // Send an email to the user with a link containing the reset token
    // const mail = {
    //     to: email,
    //     subject: 'Reset Password',
    //     from: 'francismwanik254@gmail.com', // Fill it with your validated email on SendGrid account
    //     dynamicTemplateData: {
    //      token: resetToken
      
    //     },
    //     templateId: 'd-2bfa6b101d6b420f87a210124a5ef713',
    //   };
        // await sgMail.send(mail);

    // return new NextResponse("Password reset initiated successfully!", { status: 200 });
    return NextResponse.json({ message: "Password reset initiated successfully!",
      status: 200
      });
  } catch (error: any) {
    console.error(error);
    // return new NextResponse(error.message, { status: 500 });
    return NextResponse.json({ message: error.message,
      status: 500
      });
  }
}
