import { Client, Databases, Query } from 'node-appwrite';

const validateReferralCode = async (req, res) => {
  const client = new Client();
  const databases = new Databases(client);

  // Check for required environment variables
  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY'] ||
    !req.variables['APPWRITE_FUNCTION_PROJECT_ID'] ||
    !req.variables['APPWRITE_DATABASE_ID']
  ) {
    return res.json({ success: false, message: 'Missing required environment variables.' }, 400);
  }

  client
    .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
    .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

  try {
    const { code } = JSON.parse(req.payload);
    if (!code) {
      throw new Error('Referral code is required.');
    }

    const response = await databases.listDocuments(
      req.variables['APPWRITE_DATABASE_ID'],
      'referralCodes', // The ID of your referral codes collection
      [Query.equal('code', code), Query.limit(1)]
    );

    if (response.total === 0) {
      throw new Error('This referral code does not exist.');
    }

    const referralDoc = response.documents[0];

    if (!referralDoc.isActive) {
      throw new Error('This referral code is no longer active.');
    }

    // Success! Return the details.
    res.json({
      success: true,
      data: {
        userName: referralDoc.userName,
        discountPercent: referralDoc.discountPercent,
      },
    });
  } catch (e) {
    // Any error will result in a failure message
    res.json({ success: false, message: e.message || 'An error occurred.' }, 400);
  }
};

export default validateReferralCode;
