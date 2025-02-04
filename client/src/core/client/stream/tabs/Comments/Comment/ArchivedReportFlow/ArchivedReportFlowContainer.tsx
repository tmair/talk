import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { URLViewType } from "coral-stream/constants";
import {
  ButtonSvgIcon,
  ShareExternalLinkIcon,
} from "coral-ui/components/icons";
import { Button } from "coral-ui/components/v3";

import { ArchivedReportFlowContainer_comment } from "coral-stream/__generated__/ArchivedReportFlowContainer_comment.graphql";
import { ArchivedReportFlowContainer_settings } from "coral-stream/__generated__/ArchivedReportFlowContainer_settings.graphql";
import { ArchivedReportFlowContainerLocal } from "coral-stream/__generated__/ArchivedReportFlowContainerLocal.graphql";

import PermalinkCopyButton from "../PermalinkButton/PermalinkCopyButton";

import styles from "./ArchivedReportFlowContainer.css";

interface Props {
  settings: ArchivedReportFlowContainer_settings;
  comment: ArchivedReportFlowContainer_comment;
}

const ArchivedReportFlowContainer: FunctionComponent<Props> = ({
  settings,
  comment,
}) => {
  const { localeBundles } = useCoralContext();

  const [{ dsaFeaturesEnabled }] = useLocal<ArchivedReportFlowContainerLocal>(
    graphql`
      fragment ArchivedReportFlowContainerLocal on Local {
        dsaFeaturesEnabled
      }
    `
  );

  const permalinkURL = getURLWithCommentID(comment.story.url, comment.id);

  const subject = getMessage(
    localeBundles,
    "comments-archivedReportPopover-emailSubject",
    "Report comment"
  );
  const emailBody = getMessage(
    localeBundles,
    "comments-archivedReportPopover-emailBody",
    `
      I would like to report the following comment:
      %0A
      ${permalinkURL}
      %0A
      %0A
      For the reasons stated below:
    `,
    {
      permalinkURL,
    }
  );

  const reportLink = getURLWithCommentID(
    comment.story.url,
    comment.id,
    URLViewType.IllegalContentReport
  );

  return (
    <div className={styles.root}>
      <Localized id="comments-archivedReportPopover-reportThisComment">
        <div className={styles.title}>Report This Comment</div>
      </Localized>

      <Localized
        id="comments-archivedReportPopover-doesThisComment"
        elems={{
          a: (
            <a
              href={`mailto:${settings.organization.contactEmail}?subject=${subject}&body=${emailBody}`}
            >
              {settings.organization.name}
            </a>
          ),
        }}
        vars={{ orgName: settings.organization.name }}
      >
        <div className={styles.body}>
          Does this comment violate our community guidelines? Is this offensive
          or spam? Send an email to our moderation team at org email address
          with a link to this comment and a brief explanation.
        </div>
      </Localized>

      {dsaFeaturesEnabled && (
        <Button
          className={styles.illegalContentReportButton}
          variant="flat"
          color="primary"
          fontSize="medium"
          fontWeight="semiBold"
          paddingSize="none"
          target="_blank"
          anchor
          textAlign="left"
          underline
          href={reportLink}
        >
          <Localized id="comments-reportForm-reportIllegalContent-button">
            <span>This comment contains illegal content</span>
          </Localized>
          <ButtonSvgIcon
            className={styles.linkIcon}
            Icon={ShareExternalLinkIcon}
          />
        </Button>
      )}

      <Localized id="comments-archivedReportPopover-needALink">
        <div className={styles.heading}>Need a link to this comment?</div>
      </Localized>

      <PermalinkCopyButton
        permalinkURL={permalinkURL}
        commentID={comment.id}
        variant="outlined"
        paddingSize="extraSmall"
        upperCase
        className={CLASSES.reportPopover.copyButton}
      />
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ArchivedReportFlowContainer_settings on Settings {
      organization {
        name
        contactEmail
      }
    }
  `,
  comment: graphql`
    fragment ArchivedReportFlowContainer_comment on Comment {
      id
      story {
        url
      }
    }
  `,
})(ArchivedReportFlowContainer);

export default enhanced;
