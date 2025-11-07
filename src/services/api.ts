/**
 * API Service for Spring Boot Backend Integration
 * Handles communication with the payment-service backend
 */

import { getConfig } from "../config/config";

// Get API base URL from config
const getApiBaseUrl = (): string => {
  const config = getConfig();
  return config.api.baseUrl;
};

// Plaid transaction types (matching backend response)
export interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  name: string;
  merchant_name?: string;
  category?: string[];
  account_owner?: string;
}

export interface PlaidAccount {
  account_id: string;
  name: string;
  type?: string;
  subtype?: string;
  [key: string]: unknown;
}

export interface TransactionsGetResponse {
  transactions?: PlaidTransaction[];
  accounts?: PlaidAccount[];
  total_transactions?: number;
  request_id?: string;
}

/**
 * Fetches user transactions from Spring Boot backend using Auth0 token
 * @param auth0AccessToken The Auth0 access token
 * @param startDate Optional start date (yyyy-MM-dd format)
 * @param endDate Optional end date (yyyy-MM-dd format)
 * @returns Transactions response from backend
 */
export const fetchUserTransactions = async (
  auth0AccessToken: string,
  startDate?: string,
  endDate?: string
): Promise<TransactionsGetResponse> => {
  const apiBaseUrl = getApiBaseUrl();
  const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/api/user/transactions`;
  
  const requestBody: {
    auth0AccessToken: string;
    startDate?: string;
    endDate?: string;
  } = {
    auth0AccessToken: auth0AccessToken,
  };

  if (startDate) {
    requestBody.startDate = startDate;
  }
  if (endDate) {
    requestBody.endDate = endDate;
  }

  console.log('Fetching user transactions from:', endpoint);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    const errorMessage = errorData.message || errorData.error || `Failed to fetch transactions (${response.status})`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('User transactions response:', data);
  return data;
};

/**
 * Alternative method using Authorization header (GET request)
 * @param auth0AccessToken The Auth0 access token
 * @param startDate Optional start date (yyyy-MM-dd format)
 * @param endDate Optional end date (yyyy-MM-dd format)
 * @returns Transactions response from backend
 */
export const fetchUserTransactionsByHeader = async (
  auth0AccessToken: string,
  startDate?: string,
  endDate?: string
): Promise<TransactionsGetResponse> => {
  const apiBaseUrl = getApiBaseUrl();
  const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/api/user/transactions`;
  
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  
  const url = params.toString() ? `${endpoint}?${params.toString()}` : endpoint;

  console.log('Fetching user transactions from:', url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${auth0AccessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    const errorMessage = errorData.message || errorData.error || `Failed to fetch transactions (${response.status})`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('User transactions response:', data);
  return data;
};

