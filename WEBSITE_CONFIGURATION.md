# Typesense Configuration

## Server Details
- **Version:** Typesense v0.23.1 (Server Side)
- **Host:** `v6eba1srpfohj89dp-1.a1.typesense.net`
- **Port:** `443`
- **Protocol:** `https`
- **Collection:** `07cb7c095c0cf712732a976016079e19`
  *(Note: This is specific for Cardora and changes depending on the customer we are trying to connect.)*

## Authentication
Each page will have a PRE-DEFINED KEY.

**Example for INSTOCK & SOLD inventories:**
```text
ZWoxa3NxVmJLWFBOK2dWcUFBM1V0aTJyb09wUDhFZ0R5Vnc1blc2RW9Kdz1oZmUweyJmaWx0ZXJfYnkiOiJzdGF0dXM6W0luc3RvY2ssIFNvbGRdICYmIHZpc2liaWxpdHk6PjAgJiYgZGVsZXRlZF9hdDo9MCJ9
```
*These keys are the same for all customers and are created by ZOP if necessary.*

## Libraries & Integration
To show Facets and Render Functionality, we use the Typesense Adapter alongside React InstantSearch.

- **Typesense Adapter:** [GitHub Repository](https://github.com/typesense/typesense-instantsearch-adapter)
- **React InstantSearch:** [GitHub Repository](https://github.com/algolia/react-instantsearch)

### Compatibility Requirements
Because our server is running Typesense v0.23.1, both the Typesense Adapter and React Adapter must be compatible with this server version.

**Recommended Typesense Adapter version:**
```json
"typesense-instantsearch-adapter": "~2.8.0"
```
*Note: Newer versions of the adapter have facets that do not work properly with the v0.23.1 server version. Sometimes an adapter might not work for some facets; in such cases, try downgrading the package.*

[Check Compatibility Here](https://github.com/typesense/typesense-instantsearch-adapter?tab=readme-ov-file#compatibility)

## References
- **API Documentation:** [Typesense v0.23.1 API Docs](https://typesense.org/docs/0.23.1/api/)
