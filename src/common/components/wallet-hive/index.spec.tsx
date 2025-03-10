import React from "react";

import Wallet from "./index";

import TestRenderer from "react-test-renderer";

import {createBrowserHistory} from "history";

import {initialState as transactionsInitialState} from "../../store/transactions/index";

import {globalInstance, dynamicPropsIntance1, fullAccountInstance, allOver} from "../../helper/test-helper";
import {StaticRouter} from "react-router-dom";
import {FullAccount} from "../../store/accounts/types";

jest.mock("moment", () => () => ({
    fromNow: () => "in 5 days",
}))

let MOCK_MODE = 1;

jest.mock("../../api/hive", () => ({
    getConversionRequests: () =>
        new Promise((resolve) => {

            if (MOCK_MODE === 1) {
                resolve([]);
            }

            if (MOCK_MODE === 2) {
                resolve([{
                    amount: "1200.000 SBD",
                    conversion_date: "2021-01-29T21:19:54",
                    id: 163785,
                    owner: "fooo",
                    requestid: 1040029198,
                }]);
            }
        }),
    getSavingsWithdrawFrom: () =>
        new Promise((resolve) => {

            if (MOCK_MODE === 1) {
                resolve([]);
            }

            if (MOCK_MODE === 2) {
                resolve([{
                    "id":137852,
                    "from":"ecency",
                    "to":"ecency",
                    "memo":"",
                    "request_id":3123100728,
                    "amount":"10100.297 SBD",
                    "complete":"2022-02-05T11:16:54"
                }]);
            }
        }),
    getOpenOrder: () =>
        new Promise((resolve) => {

            if (MOCK_MODE === 1) {
                resolve([]);
            }

            if (MOCK_MODE === 2) {
                resolve([{
                    "id":137852,
                    "created":"2022-02-01T11:16:54",
                    "expiration":"2022-02-28T11:16:54",
                    "seller":"ecency",
                    "orderid":3123100728,
                    "for_sale":1000,
                    "sell_price": {
                        "base": "1 STEEM",
                        "quote": "0.800 SBD"
                    },
                    "real_price": "0.900 SBD",
                    "rewarded":false
                }]);
            }
        }),
}));

const account: FullAccount = {
    ...fullAccountInstance,
    name: "user1",
    balance: "0.000 STEEM",
    delegated_vesting_shares: "0.000000 VESTS",
    next_vesting_withdrawal: "2020-06-10T18:39:30",
    received_vesting_shares: "9916.938399 VESTS",
    reward_sbd_balance: "0.000 SBD",
    reward_vesting_steem: "10.207 STEEM",
    savings_balance: "0.001 STEEM",
    savings_sbd_balance: "0.000 SBD",
    savings_sbd_last_interest_payment: "2021-03-18T15:42:03",
    savings_sbd_seconds_last_update: "2021-03-18T15:42:03",
    sbd_balance: "447.514 SBD",
    to_withdraw: "91765607000000",
    vesting_shares: "83549915.208336 VESTS",
    vesting_withdraw_rate: "7058892.846154 VESTS",
    withdrawn: "56471142769232",
};

const defProps = {
    history: createBrowserHistory(),
    global: globalInstance,
    dynamicProps: dynamicPropsIntance1,
    users: [],
    activeUser: null,
    transactions: transactionsInitialState,
    account,
    signingKey: '',
    addAccount: () => {
    },
    updateActiveUser: () => {
    },
    setSigningKey: () => {
    },
    fetchTransactions: () => {
    },
    fetchPoints: () => {
    },
    updateWalletValues: () => {
    }
}

it("(1) Default Render", async() => {
    const renderer = await TestRenderer.create(
        <StaticRouter location="/" context={{}}>
            <Wallet {...defProps} />
        </StaticRouter>);
    expect(renderer.toJSON()).toMatchSnapshot();
});

it("(2) Render with converting SBD", async () => {
    MOCK_MODE = 2;

    const renderer = await TestRenderer.create(
        <StaticRouter location="/" context={{}}>
            <Wallet {...defProps} />
        </StaticRouter>);
    await allOver();
    expect(renderer.toJSON()).toMatchSnapshot();
});

it("(3) usePrivate = false", async () => {
    const props = {
        ...defProps,
        global: {
            ...globalInstance,
            usePrivate: false
        }
    }
    const renderer = await TestRenderer.create(
        <StaticRouter location="/" context={{}}>
            <Wallet {...props} />
        </StaticRouter>);
    expect(renderer.toJSON()).toMatchSnapshot();
});
