import React from "react";
import styled from "styled-components";
import { Button, PageTitle, PageSection, PageLoaded, I18n } from "..";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #222;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  box-sizing: border-box;
  text-align: center;

  font-size: 2.5vw;
`;

export default props => (
  <I18n>{t =>
    <Wrapper>
      <PageLoaded/>
      <PageTitle>{props.title}</PageTitle>
      <PageSection>{props.message}</PageSection>
      <PageSection style={{ marginBottom: "2em" }}>
        {t("errors.action-error-subtitle")}
      </PageSection>
      <Button primary onClick={() => (window.location = window.location)}>
        {t("errors.refresh-page")}
      </Button>
    </Wrapper>
  }</I18n>
);
