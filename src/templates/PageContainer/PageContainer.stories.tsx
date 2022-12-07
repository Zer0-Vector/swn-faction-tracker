import React from "react";
import { MemoryRouter } from "react-router-dom";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { MockActionController } from "../../components/__mocks__/MockActionController";
import { MockActionUiStateController } from "../../components/__mocks__/MockActionUiStateController";
import { AuthContext } from "../../contexts/AuthContext";
import { GameContext } from "../../contexts/GameContext";
import { UiStateContext } from "../../contexts/UiStateContext";
import { ProvidedAuth } from "../../types/ProvidedAuth";
import { IGameState } from "../../types/RuntimeGameState";

import PageContainer from "./PageContainer";

export default {
  component: PageContainer,
  decorators: [
    story => (
      <MemoryRouter>
        {story()}
      </MemoryRouter>
    ),
    story => (
      <UiStateContext.Provider value={{
        state: {
          loginState: "LOGGED_OUT",
        },
        controller: MockActionUiStateController,
      }}>
        {story()}
      </UiStateContext.Provider>
    ),
    story => (
      <AuthContext.Provider value={{
        currentUser: null,
      } as ProvidedAuth}>
        {story()}
      </AuthContext.Provider>
    ),
    story => (
      <GameContext.Provider value={{
        state: {
          mode: "EDIT",
        } as IGameState,
        controller: MockActionController,
      }}>
        {story()}
      </GameContext.Provider>
    ),
  ],
} as ComponentMeta<typeof PageContainer>;

const Template: ComponentStory<typeof PageContainer> = () => (
  <PageContainer>
    <p>Test 123</p>
    <p>Test 456</p>
  </PageContainer>
);

export const Default = Template.bind({});
