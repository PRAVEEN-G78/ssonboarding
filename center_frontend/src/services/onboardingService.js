const API_URL = 'http://localhost:5000/api';

export const onboardingService = {
  // Submit onboarding form data
  async submitOnboardingData(formData) {
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  },

  // Get onboarding data for an employee
  async getEmployeeData(employeeId) {
    try {
      const response = await fetch(`${API_URL}/employees/${employeeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch employee data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching employee data:', error);
      throw error;
    }
  },

  // Upload document
  async uploadDocument(employeeId, documentType, file) {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', documentType);

      const response = await fetch(`${API_URL}/employees/${employeeId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  async updateEmployeeData(employeeId, formData) {
    try {
      const response = await fetch(`${API_URL}/employees/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating employee data:', error);
      throw error;
    }
  }
}; 