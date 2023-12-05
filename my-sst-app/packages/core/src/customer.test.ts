
import { Config } from "sst/node/config";
import { describe, it, expect } from "vitest";
import { Api } from "../../../common/api/Api";

describe("customer endpoint", () => {
    const apiClient = new Api({
      BASE: Config.HTTP_API,
    }).default;
  
    it("get customer - valid", async () => {
      const appId = "d290f1ee-6c54-4b01-90e6-d701748f0851";
      const customer = {
        customerId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        phoneNumber: "1234567890",
        loyaltyCardId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
      };
  
      const response = await apiClient.getCustomers(appId, "1234567890");
      console.log(response);
      expect(response).toEqual({
        appId: "d290f1ee-6c54-4b01-90e6-d701748f0851",
        ...customer,
      });
    });
  });