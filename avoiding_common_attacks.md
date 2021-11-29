# Contract security measures

## SWC-103 Floating pragma

Specific compiler pragma `0.8.0` used as that is the version the contract have been tested thoroughly. Locking the pragma helps to ensure that contracts do not accidentally get deployed using, for example, an outdated compiler version that might introduce bugs that affect the contract system negatively.

## SWC-113 DoS with Failed Call
External calls can fail accidentally or deliberately, which can cause a DoS condition in the contract. To minimize the damage caused by such failures, it is better to isolate each external call into its own transaction that can be initiated by the recipient of the call.

## SWC-108 State Variable Default Visibility
Labeling the visibility explicitly makes it easier to catch incorrect assumptions about who can access the variable.

## SWC-111 Use of Deprecated Solidity Functions
Several functions and operators in Solidity are deprecated. Using them leads to reduced code quality. With new major versions of the Solidity compiler, deprecated functions and operators may result in side effects and compile errors.




