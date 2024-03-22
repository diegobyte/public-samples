import { Client, KustoConnectionStringBuilder } from "azure-kusto-data";

import { PageLayout } from "./PageLayout";
import { loginRequest } from "./authConfig";

import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

import "./App.css";

import Button from "react-bootstrap/Button";
import { config } from "./Constants";

const ProfileContent = () => {
  const { instance, accounts } = useMsal();

  async function QueryKusto() {
    try {
      const req = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const accessToken = req.accessToken;

      console.log({ accessToken });

      const kcsb = KustoConnectionStringBuilder.withAccessToken(
        config.clusterUri,
        accessToken
      );
      const client = new Client(kcsb);

      const database = "Cloud";
      const query = "CloudTable | take 1";
      const res = await client.executeQuery(database, query);
      console.log("di: res: ", res);
    } catch (e) {
      console.log("di: error: ", JSON.stringify(e, null, 2), e);
    }
  }

  return (
    <>
      <h5 className="card-title">Welcome {accounts[0].name}</h5>
      <br />
      <>
        <Button variant="secondary" onClick={QueryKusto}>
          Query Kusto
        </Button>
      </>
    </>
  );
};

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <ProfileContent />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5>
          <center>Please sign-in to see your profile information.</center>
        </h5>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default function App() {
  return (
    <PageLayout>
      <center>
        <MainContent />
      </center>
    </PageLayout>
  );
}
