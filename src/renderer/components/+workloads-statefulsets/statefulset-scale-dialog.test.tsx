/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "@testing-library/jest-dom/extend-expect";

import { StatefulSet, StatefulSetApi } from "../../../common/k8s-api/endpoints";
import { StatefulSetScaleDialog } from "./statefulset-scale-dialog";
import { render, waitFor, fireEvent } from "@testing-library/react";
import React from "react";

const dummyStatefulSet: StatefulSet = {
  apiVersion: "v1",
  kind: "dummy",
  metadata: {
    uid: "dummy",
    name: "dummy",
    creationTimestamp: "dummy",
    resourceVersion: "dummy",
    selfLink: "link",
  },
  selfLink: "link",

  spec: {
    serviceName: "dummy",
    replicas: 1,
    selector: {
      matchLabels: { "label": "label" },
    },
    template: {
      metadata: {
        labels: {
          app: "app",
        },
      },
      spec: {
        containers: [{
          name: "dummy",
          image: "dummy",
          ports: [{
            containerPort: 1234,
            name: "dummy",
          }],
          volumeMounts: [{
            name: "dummy",
            mountPath: "dummy",
          }],
        }],
        tolerations: [{
          key: "dummy",
          operator: "dummy",
          effect: "dummy",
          tolerationSeconds: 1,
        }],
      },
    },
    volumeClaimTemplates: [{
      metadata: {
        name: "dummy",
      },
      spec: {
        accessModes: ["dummy"],
        resources: {
          requests: {
            storage: "dummy",
          },
        },
      },
    }],
  },
  status: {
    observedGeneration: 1,
    replicas: 1,
    currentReplicas: 1,
    readyReplicas: 1,
    currentRevision: "dummy",
    updateRevision: "dummy",
    collisionCount: 1,
  },

  getImages: jest.fn(),
  getReplicas: jest.fn(),
  getSelectors: jest.fn(),
  getTemplateLabels: jest.fn(),
  getAffinity: jest.fn(),
  getTolerations: jest.fn(),
  getNodeSelectors: jest.fn(),
  getAffinityNumber: jest.fn(),
  getId: jest.fn(),
  getResourceVersion: jest.fn(),
  getName: jest.fn(),
  getNs: jest.fn(),
  getAge: jest.fn(),
  getTimeDiffFromNow: jest.fn(),
  getFinalizers: jest.fn(),
  getLabels: jest.fn(),
  getAnnotations: jest.fn(),
  getOwnerRefs: jest.fn(),
  getSearchFields: jest.fn(),
  toPlainObject: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
};

describe("<StatefulSetScaleDialog />", () => {
  let statefulSetApi: StatefulSetApi;

  beforeEach(() => {
    statefulSetApi = new StatefulSetApi({
      objectConstructor: StatefulSet,
    });
  });

  it("renders w/o errors", () => {
    const { container } = render(<StatefulSetScaleDialog statefulSetApi={statefulSetApi} />);

    expect(container).toBeInstanceOf(HTMLElement);
  });

  it("init with a dummy stateful set and mocked current/desired scale", async () => {
    // mock statefulSetApi.getReplicas() which will be called
    // when <StatefulSetScaleDialog /> rendered.
    const initReplicas = 1;

    statefulSetApi.getReplicas = jest.fn().mockImplementationOnce(async () => initReplicas);
    const { getByTestId } = render(<StatefulSetScaleDialog statefulSetApi={statefulSetApi} />);

    StatefulSetScaleDialog.open(dummyStatefulSet);
    // we need to wait for the StatefulSetScaleDialog to show up
    // because there is an <Animate /> in <Dialog /> which renders null at start.
    await waitFor(async () => {
      const [currentScale, desiredScale] = await Promise.all([
        getByTestId("current-scale"),
        getByTestId("desired-scale"),
      ]);

      expect(currentScale).toHaveTextContent(`${initReplicas}`);
      expect(desiredScale).toHaveTextContent(`${initReplicas}`);
    });
  });

  it("changes the desired scale when clicking the icon buttons +/-", async () => {
    const initReplicas = 1;

    statefulSetApi.getReplicas = jest.fn().mockImplementationOnce(async () => initReplicas);
    const component = render(<StatefulSetScaleDialog statefulSetApi={statefulSetApi} />);

    StatefulSetScaleDialog.open(dummyStatefulSet);
    await waitFor(async () => {
      expect(await component.findByTestId("desired-scale")).toHaveTextContent(`${initReplicas}`);
      expect(await component.findByTestId("current-scale")).toHaveTextContent(`${initReplicas}`);
      expect((await component.baseElement.querySelector("input").value)).toBe(`${initReplicas}`);
    });

    const up = await component.findByTestId("desired-replicas-up");
    const down = await component.findByTestId("desired-replicas-down");

    fireEvent.click(up);
    expect(await component.findByTestId("desired-scale")).toHaveTextContent(`${initReplicas + 1}`);
    expect(await component.findByTestId("current-scale")).toHaveTextContent(`${initReplicas}`);
    expect((await component.baseElement.querySelector("input").value)).toBe(`${initReplicas + 1}`);

    fireEvent.click(down);
    expect(await component.findByTestId("desired-scale")).toHaveTextContent(`${initReplicas}`);
    expect(await component.findByTestId("current-scale")).toHaveTextContent(`${initReplicas}`);
    expect((await component.baseElement.querySelector("input").value)).toBe(`${initReplicas}`);

    // edge case, desiredScale must >= 0
    let times = 10;

    for (let i = 0; i < times; i++) {
      fireEvent.click(down);
    }
    expect(await component.findByTestId("desired-scale")).toHaveTextContent("0");
    expect((await component.baseElement.querySelector("input").value)).toBe("0");

    // edge case, desiredScale must <= scaleMax (100)
    times = 120;

    for (let i = 0; i < times; i++) {
      fireEvent.click(up);
    }
    expect(await component.findByTestId("desired-scale")).toHaveTextContent("100");
    expect((component.baseElement.querySelector("input").value)).toBe("100");
    expect(await component.findByTestId("warning"))
      .toHaveTextContent("High number of replicas may cause cluster performance issues");
  });
});
