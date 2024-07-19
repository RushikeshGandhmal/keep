import React, { useState } from "react";
import { MockAction, MockStep, MockWorkflow, Workflow } from "./models";
import { getApiURL } from "../../utils/apiUrl";
import Loading from "../loading";
import { Button, Card, Tab, TabGroup, TabList } from "@tremor/react";
import Modal from "@/components/ui/Modal";
import PageClient from "./builder/page.client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TiArrowRight } from "react-icons/ti";
import './workflowStyles.css';

export function WorkflowSteps({ workflow }: { workflow: MockWorkflow }) {
  const isStepPresent =
    !!workflow?.steps?.length &&
    workflow?.steps?.find((step: MockStep) => step?.provider?.type);
  return (
    <div className="flex gap-2 items-center mb-4">
      {workflow?.steps?.map((step: any, index: number) => {
        const provider = step?.provider;
        return (
          <>
            {provider && (
              <div key={`step-${index}`} className="flex items-end gap-2">
                {index > 0 && (
                  <TiArrowRight className="text-gray-500 size-8 align-self: center" />
                )}
                <Image
                  src={`/icons/${provider?.type}-icon.png`}
                  width={30}
                  height={30}
                  alt={provider?.type}
                  className="mt-6"
                />
              </div>
            )}
          </>
        );
      })}
      {workflow?.actions?.map((action: any, index: number) => {
        const provider = action?.provider;
        return (
          <>
            {provider && (
              <div key={`action-${index}`} className="flex items-end gap-2">
                {(index > 0 || isStepPresent) && (
                  <TiArrowRight className="text-gray-500 size-8 align-self: center" />
                )}
                <Image
                  src={`/icons/${provider?.type}-icon.png`}
                  width={30}
                  height={30}
                  alt={provider?.type}
                  className="mt-6"
                />
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}

export const MockFilterTabs = ({
  tabs,
}: {
  tabs: { name: string; onClick?: () => void }[];
}) => (
  <div className="max-w-lg space-y-12">
    <TabGroup>
      <TabList variant="solid">
        {tabs?.map(
          (tab: { name: string; onClick?: () => void }, index: number) => (
            <Tab key={index} value={tab.name}>
              {tab.name}
            </Tab>
          )
        )}
      </TabList>
    </TabGroup>
  </div>
);

export default function MockWorkflowCardSection({
  mockWorkflows,
  mockError,
  mockLoading,
}: {
  mockWorkflows: MockWorkflow[];
  mockError: any;
  mockLoading: boolean | null;
}) {
  const router = useRouter();

  const getNameFromId = (id: string) => {
    if (!id) {
      return "";
    }

    return id.split("-").join(" ");
  };

  // if mockError is not null, handle the error case
  if (mockError) {
    return <p>Error: {mockError.message}</p>;
  }

  return (
    <section className="pt-10 mt-10">
      <div className="p-4 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center sm:text-left">
          Discover existing workflow templates
        </h2>
        {/* <div className="flex flex-col sm:flex-row items-center justify-between mb-6 flex-wrap gap-2 min-w-full">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search through workflow examples..."
              className="px-4 py-2 border rounded w-full sm:w-auto"
            />
            <button className="px-4 py-2 bg-gray-200 border rounded">
              Integrations used
            </button>
          </div>
          <MockFilterTabs 
            tabs={[
              { name: "All workflows" },
              { name: "Notifications" },
              { name: "Databases" },
              { name: "CI/CD" },
              { name: "Other" },
            ]}
          />
        </div> */}
      </div>

      {mockError && (
        <p className="text-center text-red-100 m-auto">
          Error: {mockError.message || "Something went wrong!"}
        </p>
      )}
      {!mockLoading && !mockError && mockWorkflows.length === 0 && (
        <p className="text-center m-auto">No workflows found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockError && (
          <p className="text-center text-red-100">
            Error: {mockError.message || "Something went wrong!"}
          </p>
        )}
        {mockLoading && <Loading />}
        {!mockLoading &&
          mockWorkflows.length > 0 &&
          mockWorkflows.map((template: any, index: number) => {
            const workflow = template.workflow;
            return (
              <Card key={index} className="p-4 flex flex-col justify-between">
                <div className="overflow-hidden>
                  <WorkflowSteps workflow={workflow} />
                  <h3 className="text-lg sm:text-xl font-semibold line-clamp-2">
                    {workflow.name || getNameFromId(workflow.id)}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base line-clamp-3 custom-truncate">
                    {workflow.description}
                  </p>
                </div>
                <div>
                  <Button
                    className="inline-block mt-8 px-4 py-2 border-none bg-gray-200 hover:bg-gray-300 bold-medium transition text-black rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.setItem(
                        "preview_workflow",
                        JSON.stringify(template)
                      );
                      router.push(`/workflows/preview/${workflow.id}`);
                    }}
                  >
                    Preview
                  </Button>
                </div>
              </Card>
            );
          })}
      </div>
    </section>
  );
}
