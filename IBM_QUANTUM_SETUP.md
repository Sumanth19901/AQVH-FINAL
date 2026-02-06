# IBM Quantum Setup Guide

This guide will help you obtain and configure your IBM Quantum credentials to enable live backend connectivity for the IBM Quantum Observer application.

## Prerequisites

- An IBM account (create one at https://www.ibm.com/account/reg/signup if you don't have one)
- Access to IBM Quantum Platform (free tier available)

## Step-by-Step Instructions

### 1. Create an IBM Quantum Account

1. Go to [IBM Quantum Platform](https://quantum.ibm.com/)
2. Click **"Sign in"** or **"Start for free"**
3. Login with your IBM account or create a new one
4. Accept the terms and conditions

### 2. Get Your API Token

1. Once logged in, click on your **profile icon** in the top right corner
2. Select **"Account settings"** from the dropdown menu
3. In the Account settings page, you'll see an **"API token"** section
4. Click **"Copy token"** or **"Generate new token"** if you don't have one
5. Save this token securely - this is your `IBM_QUANTUM_TOKEN`

### 3. Get Your Instance CRN

1. Stay on the IBM Quantum Platform at https://quantum.ibm.com/
2. Navigate to your **Account** page (usually at https://quantum.ibm.com/account)
3. Look for your **IBM Cloud instances** section
4. Find the **CRN (Cloud Resource Name)** - it looks like:
   ```
   crn:v1:bluemix:public:quantum-computing:us-east:a/YOUR_ACCOUNT_ID:YOUR_INSTANCE_ID::
   ```
5. Copy the entire CRN - this is your `IBM_QUANTUM_INSTANCE`

**Note:** If you don't see an instance, you may need to:
- Go to [IBM Cloud Quantum Computing](https://cloud.ibm.com/catalog/services/quantum-computing)
- Create a free instance (Lite plan is available at no cost)
- Once created, return to get the CRN

### 4. Configure Your Application

1. Open the `.env` file in the project root directory
2. Replace the placeholder values with your credentials:

```bash
IBM_QUANTUM_TOKEN=your_actual_token_here
IBM_QUANTUM_INSTANCE=crn:v1:bluemix:public:quantum-computing:us-east:a/YOUR_ACCOUNT_ID:YOUR_INSTANCE_ID::
IBM_QUANTUM_CHANNEL=ibm_cloud
```

3. Save the file

### 5. Restart the Backend Server

The backend server needs to be restarted to load the new credentials:

1. Stop the current backend server (Ctrl+C in the terminal running `uvicorn`)
2. Restart it with:
   ```bash
   ./venv/bin/uvicorn backend:app --reload
   ```

### 6. Verify Connection

Once the backend restarts, you should see:
```
✅ Connected to IBM Quantum Runtime service
```

If you see warnings about missing credentials, double-check your `.env` file.

## Troubleshooting

### "Invalid API token" Error

- **Solution:** Your token may have expired. Generate a new token from IBM Quantum Platform
- Ensure there are no extra spaces or quotes around the token value in `.env`

### "Instance not found" Error

- **Solution:** Verify your CRN is correct and complete
- Make sure you've created an IBM Quantum instance in IBM Cloud
- Ensure the instance is active and not expired

### Cannot Find CRN

- Go to: https://cloud.ibm.com/resources
- Look for "Quantum Computing" under Services
- Click on your quantum computing instance
- The CRN should be visible in the instance details

### Backend Still Using Demo Mode

- Ensure you saved the `.env` file after editing
- Restart the backend server completely (kill and restart)
- Check the terminal output for connection confirmation messages

## Free Tier Limitations

IBM Quantum offering free tier includes:
- Access to simulators
- Limited access to real quantum hardware
- Queue priority may be lower than paid tiers
- Some backends may have usage limits

Refer to [IBM Quantum Pricing](https://www.ibm.com/quantum/pricing) for current limitations and upgrade options.

## Security Best Practices

⚠️ **IMPORTANT:** Never commit your `.env` file to version control!

- The `.env` file is already in `.gitignore`
- Never share your API token publicly
- Regenerate your token if it's been compromised
- Use different tokens for development and production environments

## Additional Resources

- [IBM Quantum Documentation](https://docs.quantum.ibm.com/)
- [Qiskit Runtime Documentation](https://docs.quantum.ibm.com/api/qiskit-ibm-runtime)
- [IBM Quantum Learning](https://learning.quantum.ibm.com/)
- [Qiskit Textbook](https://qiskit.org/textbook/)

## Support

If you encounter issues:
1. Check [IBM Quantum Status](https://quantum.ibm.com/status) for service outages
2. Visit [IBM Quantum Community](https://quantum.ibm.com/community)
3. Consult the [Qiskit Slack](https://qiskit.slack.com/)
