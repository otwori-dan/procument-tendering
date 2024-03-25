import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req: Request, res: Response) {
  if (!req.body) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  /* 
   companyName: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      projectTitle: "",
      projectDescription: "",
      projectUnderstanding: "",
      companyWebsite: "",
      timeline: "",
      closingStatement: ""
  */
  try {
    const {
      status,
      date,
      applicantId,
      tenderId,
      proposal,
      NID,
      amount,
      duration,
      completionDate,
      kraPin,
      location,
      phoneNumber,
      companyName,
      contactPerson,
      contactEmail,
      contactPhone,
      projectTitle,
      projectDescription,
      projectUnderstanding,
      companyWebsite,
      timeline,
      closingStatement,
      bankStamentUrlAttachment,
      subModules
    } = await req.json();


    // Check if all required fields are provided
    // if (!date || !applicantId || !tenderId || !proposal || !NID || !amount || !duration || !completionDate || !kraPin || !location || !phoneNumber || !companyName || !contactPerson || !contactEmail || !contactPhone || !projectTitle || !projectDescription || !projectUnderstanding || !companyWebsite || !timeline || !closingStatement) {
    //   return NextResponse.json({
    //     message: "All fields are required",
    //     status: 400,
    //   });
    // }
    console.log("date", date, "applicantId", applicantId, "tenderId", tenderId, "proposal", proposal, "NID", NID, "amount", amount, "duration", duration, "completionDate", completionDate, "kraPin", kraPin, "location", location, "phoneNumber", phoneNumber, "companyName", companyName, "contactPerson", contactPerson, "contactEmail", contactEmail, "contactPhone", contactPhone, "projectTitle", projectTitle, "projectDescription", projectDescription, "projectUnderstanding", projectUnderstanding, "companyWebsite", companyWebsite, "timeline", timeline, "closingStatement", closingStatement, "bankStamentUrlAttachment", bankStamentUrlAttachment, "subModules", subModules);
    


  
    let transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'wearsworks@gmail.com', // Add your username here
        pass: 'AYcB4Sy65MJEDzsF', // Use your master password here
      },
    });



    // Check if the tender exists in the database
    const tender = await prisma.tender.findFirst({
      where: {
        id: tenderId,
      },
    });

    console.log("tender", tender);
    
    if (!tender) {
      return NextResponse.json({
        message: "No such tender",
        status: 400,
      });
    }


  //  Check if the applicant exists
    const applicant = await prisma.applicant.findFirst({
      where: {
        id: applicantId,
      },
    });

    console.log("applicant", applicant);

    if (!applicant) {
      return NextResponse.json({
        message: "No such applicant",
        status: 400,
      });
    }
      // make sure the applicant is not applying for the same tender twice
    const existingApplication = await prisma.application.findFirst({
      where: {
        applicantId: applicantId,
        tenderId: tender.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json({
        message: "You have already applied for this tender",
        status: 400,
      });
    }

    // Create the application using Prisma
    const newApplication = await prisma.application.create({
      data: {
    
        status: status || "pending", // Set a default value if status is not provided
        date,
        applicantId: applicantId,
        tenderId: tender.id,
        proposal,
        NID:NID,
        amount,
        duration: '1 month', // Set a default value if duration is not provided
        completionDate,
        kraPin,
        location,
        phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyName,
        contactPerson,
        contactEmail,
        contactPhone,
        projectTitle,
        projectDescription,
        projectUnderstanding,
        companyWebsite,
        timeline,
        closingStatement,
        bankStamentUrlAttachment,
        subModules


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
        subject: 'Application Created ✔', // Subject line
        text: 'Application Created!', // plain text body
        html: `
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f9f9f9;">

    <section style="padding: 20px; background-color: #4285f4; color: #ffffff; text-align: center;">
        <h1 style="margin: 0; padding:  20px 0; margin-bottom:5px; background-color: #333; color: #f4f4f4;">WearsWorks</h1>
        <strong>Application Submitted</strong>
        <p>Application ID: ${applicantId}</p>
        <p>Applicant ID: ${applicantId}</p>
        <p>Tender ID: ${tenderId}</p>
        <p>Application Date: ${date}</p>
        <p>Application Status: ${status}</p>
        

        <p>Please note that your application has been successfully submitted.</p>

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
        message: 'Application created  successfully',
        status: 200,
        data: info,
      });
    }

    return NextResponse.json({
      message: "Application created successfully",
      status: 200,
      data: newApplication, // Optionally, you can send back the created application data
    });
  } catch (error: any) {
    console.log("Error creating application", error);
    
    return NextResponse.json({
      message: error.message,
      status: 500,
    });
  }
}
