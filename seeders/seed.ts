const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTenders() {
  try {
    
      const admin = await prisma.admin.create({
        data: {
          username: 'otwory',
          email: 'otworidanvas45@gmail.com',
          password: '@otwory1',
          priviledge: true,
          verificationToken: null, // Add if necessary
          isVerified: true, // or false depending on your requirements
          verificationTokenExpiry: null, // Add if necessary
          resetToken: null, // Add if necessary
          resetTokenExpiry: null, // Add if necessary
          profile_pic: 'https://res.cloudinary.com/dzvtkbjhc/image/upload/v1704196342/francc_ymmkkz.png',
          // Add other admin fields here
        },
      });
  
    //   console.log('Created Admin:', admin);
  
} catch (error) {
    console.error('Error creating admin:', error);
}
}

createTenders();
