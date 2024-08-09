const newsLetterEmail = (clientName) =>
  `<p>Hi ${clientName}, here you have today news.</p>`;
const welcomeEmail = (clientName, username) =>
  `<p>Welcome ${clientName}, your username is ${username}.</p>`;

const registermail = (
  comapnyName,
  email_link,
  token
) => `<p>Dear ${comapnyName},\n 
   
Thank you for registering with EEL Online portal. We're excited to welcome you to our platform!\n

To complete your registration and unlock the full potential of our services, please verify your email address by clicking the link below:\n

<a href="${email_link}/${token}">verification link</a>

If you are unable to click the link, please copy and paste the following URL into your web browser's address bar.\n
 
Please note that this confirmation link will expire in 48 hours for security reasons. This is an automated message, please do not reply.\n 

If you have any questions or concerns regarding EEL, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.\n 

Thank you,\n 
EEL Team`;

// const registermail = (
//     comapnyName,
//     email_link,
//     token
//   ) => `<p>Dear ${comapnyName},</br></br>

//   Thank you for registering with EEL Online portal. We're excited to welcome you to our platform!</br></br>

//   To complete your registration and unlock the full potential of our services, please verify your email address by clicking the link below:</br></br>

//   <a href="${email_link}/${token}">verification link</a>

//   If you are unable to click the link, please copy and paste the following URL into your web browser's address bar.</br></br>

//   Please note that this confirmation link will expire in 48 hours for security reasons. This is an automated message, please do not reply.</br></br>

//   If you have any questions or concerns regarding EEL, please do not hesitate to contact our customer support team at enquiries.eel@eel.interior.gov.ng or +234-7080647200.</br></br>

//   Thank you,\n
//   EEL Team</p>`;

let sendcardEmail = (
  companyname,
  name,
  eelPortal_link,
  eelApp_link,
  eelurl_link
) =>
  `<p>
      Dear ${companyname},<br/></br>
      
      The EEL card for your Employee, ${name}, has been successfully generated.<br/></br> 
      Methods to download the EEL Card<br/></br>
       A) Company
      representatives can download the EEL Card from the Employee List section
      within the  <a href=${eelPortal_link}>link</a> Link.<br/></br> B) To access the EEL card, Employees
      can download the EEL Application by clicking on the below link and
      following steps:<br/></br> For Android Users:
      <a href=${eelApp_link}>click here</a><br/> Following the download of the EEL
      Application, please proceed with the mentioned steps<br/></br> Step 1. Sign up
      with a registered email address.<br/> Step 2. Verify Email with OTP<br/> Step 3.
      Reset your password using the temporary password received in the email.<br/>
      Step 4. Log in with your email and updated password to access the EELMS
      card.<br/></br> Please ensure that you review the details carefully to ensure
      accuracy while creating your account.<br/></br> This is an automated message,
      please do not reply. If you have any questions or concerns regarding your
      EEL Digital Card, please do not hesitate to contact our customer support
      team at<br/> </br> <a href=${eelurl_link}>link</a> or +234-7080647200. Thank
      you,<br/> EEL Help Desk
    </p>
  `;

module.exports = { newsLetterEmail, welcomeEmail, registermail, sendcardEmail };
