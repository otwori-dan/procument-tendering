import nodemailer from 'nodemailer';
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: Request, res: Response) {
  const { applicationId, applicantId } = await req.json();

    if (!applicationId || !applicantId) {
    return NextResponse.json({
      message: 'Invalid request',
      status: 400,
    });
    }

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'wearsworks@gmail.com', // Add your username here
        pass: 'AYcB4Sy65MJEDzsF', // Use your master password here
      },
    });

    const getEmail = await  prisma.applicant.findUnique({
      where:{
        id:applicantId
      },
      select:{
        email:true
      }
    })

    if (req.method === 'POST') {
      let info = await transporter.sendMail({
        from: '"WearsWorks 👻" <wearsworks@gmail.com>', // sender address
        to: getEmail?.email || 'francismwanik254@gmail.com',
        subject: 'Tender Approval ✔', // Subject line
        text: 'Approved Allow Location!', // plain text body
        html: `
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0;">

        <section style="padding: 20px; background-color: #4CAF50; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; margin-bottom:5px; padding: 20px 0; background-color: #333;">Tenders</h1>
            <strong>Application Approved Successfully</strong>
            <p>Application ID: ${applicationId}</p>
            <p>Applicant ID: ${applicantId}</p>
    
            <p>Please note that the tender has been approved, and you can now proceed to the next step.</p>
    
            <p>Click <a href="https://tenders-ruby.vercel.app/approved/${applicantId}/${applicationId}" style="color: #4CAF50; background-color:green; padding:10px 5px; text-decoration: none; font-weight: bold;">here</a> to proceed to the next step.</p>
    
            <p>Thank you for choosing Tenders</p>
    
            <p>Best Regards</p>
            <p>Tender Team</p>
        </section>
    
    </body>
        
        `
      });

      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      return NextResponse.json({
        message: 'Application approved successfully',
        status: 200,
        data: info,
      });
    }
  } catch (error: any) {
    console.log('error', error.message);

    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
}
