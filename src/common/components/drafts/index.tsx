import React, { Component } from "react";

import { History, Location } from "history";

import { Form, FormControl, Modal } from "react-bootstrap";

import { Global } from "../../store/global/types";
import { ActiveUser } from "../../store/active-user/types";
import { FullAccount } from "../../store/accounts/types";

import BaseComponent from "../base";
import UserAvatar from "../user-avatar";
import LinearProgress from "../linear-progress";
import PopoverConfirm from "../popover-confirm";
import Tooltip from "../tooltip";
import Tag from "../tag";
import { error } from "../feedback";

import { _t } from "../../i18n";

import { getDrafts, Draft, deleteDraft } from "../../api/private-api";

import accountReputation from "../../helper/account-reputation";

import defaults from "../../constants/defaults.json";

import { deleteForeverSvg, pencilOutlineSvg } from "../../img/svg";

import { catchPostImage, postBodySummary, setProxyBase } from "@upvu/render-helper";
import { dateToFormatted, dateToFullRelative } from "../../helper/parse-date";

setProxyBase(defaults.imageServer);

interface ItemProps {
  history: History;
  global: Global;
  draft: Draft;
  activeUser: ActiveUser;
  editFn: (item: Draft) => void;
  deleteFn: (item: Draft) => void;
}

export class ListItem extends Component<ItemProps> {
  render() {
    const { activeUser, draft, editFn, deleteFn, global } = this.props;
    if (!activeUser.data.__loaded) {
      return null;
    }
    const fallbackImage = global.isElectron ? "./img/fallback.png" : require("../../img/fallback.png");
    const noImage = global.isElectron ? "./img/noimage.png" : require("../../img/noimage.png");

    const account = activeUser.data as FullAccount;

    const author = account.name;
    const reputation = account.reputation;

    const tags = draft.tags ? draft.tags.split(/[ ,]+/) : [];
    const tag = tags[0] || "";
    const img = catchPostImage(draft.body, 600, 500, global.canUseWebp ? "webp" : "match") || noImage;
    const summary = postBodySummary(draft.body, 200);

    const dateRelative = dateToFullRelative(draft.createdAt);
    const dateFormatted = dateToFormatted(draft.createdAt);

    return (
      <div className="drafts-list-item">
        <div className="item-header">
          <div className="item-header-main">
            <div className="author-part">
              <a className="author-avatar">{UserAvatar({ ...this.props, username: author, size: "medium" })}</a>
              <a className="author">
                {author}
                <span className="author-reputation">{accountReputation(reputation)}</span>
              </a>
            </div>
            {Tag({
              ...this.props,
              tag,
              type: "span",
              children: <a className="category">{tag}</a>,
            })}
            <span className="date" title={dateFormatted}>
              {dateRelative}
            </span>
          </div>
        </div>
        <div className="item-body">
          <div
            className="item-image"
            onClick={() => {
              editFn(draft);
            }}
          >
            <div>
              <img
                alt={draft.title}
                src={img}
                onError={(e: React.SyntheticEvent) => {
                  const target = e.target as HTMLImageElement;
                  target.src = fallbackImage;
                }}
                className={img === noImage ? "no-img" : ""}
              />
            </div>
          </div>
          <div className="item-summary">
            <div className="item-title">
              <a
                onClick={() => {
                  editFn(draft);
                }}
              >
                {draft.title}
              </a>
            </div>
            <div className="item-body">
              <a
                onClick={() => {
                  editFn(draft);
                }}
              >
                {summary}
              </a>
            </div>
          </div>
          <div className="item-controls">
            <span />
            <div className="btn-controls">
              <a
                className="btn-edit"
                onClick={() => {
                  editFn(draft);
                }}
              >
                <Tooltip content={_t("g.edit")}>
                  <span>{pencilOutlineSvg}</span>
                </Tooltip>
              </a>
              <PopoverConfirm
                onConfirm={() => {
                  deleteFn(draft);
                }}
              >
                <a className="btn-delete">
                  <Tooltip content={_t("g.delete")}>
                    <span>{deleteForeverSvg}</span>
                  </Tooltip>
                </a>
              </PopoverConfirm>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

interface Props {
  global: Global;
  history: History;
  location: Location;
  activeUser: ActiveUser;
  onHide: () => void;
  onPick?: (url: string) => void;
}

interface State {
  loading: boolean;
  list: Draft[];
  filter: string;
  innerRef: any;
}

export class Drafts extends BaseComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      list: [],
      filter: "",
      innerRef: React.createRef(),
    };
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.loading !== prevState.loading && !this.state.loading && this.state.list.length > 0) {
      this.state!.innerRef!.current && this.state!.innerRef!.current!.focus();
    }
  }

  fetch = () => {
    const { activeUser } = this.props;

    this.stateSet({ loading: true });
    getDrafts(activeUser?.username!)
      .then((items) => {
        this.stateSet({ list: this.sort(items) });
      })
      .catch(() => {
        error(_t("g.server-error"));
      })
      .finally(() => {
        this.stateSet({ loading: false });
      });
  };

  sort = (items: Draft[]) =>
    items.sort((a, b) => {
      return new Date(b.createdAt).getTime() > new Date(a.createdAt).getTime() ? 1 : -1;
    });

  delete = (item: Draft) => {
    const { activeUser, location, history } = this.props;

    deleteDraft(activeUser?.username!, item.permlink)
      .then(() => {
        const { list } = this.state;
        const nList = [...list].filter((x) => x.permlink !== item.permlink);

        this.stateSet({ list: this.sort(nList) });

        // if user editing the draft, redirect to submit page
        if (location.pathname === `/draft/${item.permlink}`) {
          history.push("/submit");
        }
      })
      .catch(() => {
        error(_t("g.server-error"));
      });
  };

  edit = (item: Draft) => {
    const { history, onHide } = this.props;

    history.push(`/draft/${item.permlink}`);
    onHide();
  };

  filterChanged = (e: React.ChangeEvent<typeof FormControl & HTMLInputElement>): void => {
    const { value } = e.target;
    this.stateSet({ filter: value });
  };

  render() {
    const { list, filter, loading } = this.state;

    return (
      <div className="dialog-content">
        {(() => {
          if (loading) {
            return <LinearProgress />;
          }

          if (list.length === 0) {
            return <div className="drafts-list">{_t("g.empty-list")}</div>;
          }

          const items = list.filter((x) => x.title.toLowerCase().indexOf(filter.toLowerCase()) !== -1);

          return (
            <>
              <div className="dialog-filter">
                <Form.Control
                  ref={this.state.innerRef}
                  type="text"
                  placeholder={_t("drafts.filter")}
                  value={filter}
                  onChange={this.filterChanged}
                />
              </div>

              {items.length === 0 && <span className="text-muted">{_t("g.no-matches")}</span>}

              {items.length > 0 && (
                <div className="drafts-list">
                  <div className="drafts-list-body">
                    {items.map((item) => (
                      <ListItem
                        key={item.permlink}
                        {...this.props}
                        draft={item}
                        editFn={this.edit}
                        deleteFn={this.delete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    );
  }
}

export default class DraftsDialog extends Component<Props> {
  hide = () => {
    const { onHide } = this.props;
    onHide();
  };

  render() {
    return (
      <Modal show={true} centered={true} onHide={this.hide} size="lg" className="drafts-modal">
        <Modal.Header closeButton={true}>
          <Modal.Title>{_t("drafts.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Drafts {...this.props} />
        </Modal.Body>
      </Modal>
    );
  }
}
