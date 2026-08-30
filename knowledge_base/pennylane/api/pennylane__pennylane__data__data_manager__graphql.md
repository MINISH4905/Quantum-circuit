---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/data_manager/graphql.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/graphql.py
license: Apache-2.0
---

## Module `pennylane/data/data_manager/graphql.py`

Module for containing graphql functionality for interacting with the Datasets Service API.

## `GraphQLError`

```python
class GraphQLError(BaseException)
```

Exception for GraphQL

## `get_graphql`

```python
def get_graphql(url: str, query: str, variables: dict[str, Any] | None=None)
```

Args:
    url: The URL to send a query to.
    query: The main body of the query to be sent.
    variables: Additional input variables to the query body.

Returns:
    string: json response.
    GraphQLError: if there no response is received or errors are received in the json response.

## `get_dataset_urls`

```python
def get_dataset_urls(class_id: str, parameters: dict[str, list[str]]) -> list[tuple[str, str]]
```

Args:
    class_id: Dataset class id e.g 'qchem', 'qspin'
    parameters: Dataset parameters e.g 'molname', 'basis'

Returns:
    list of tuples (dataset_id, dataset_url)

Example usage:
>>> get_dataset_urls("qchem", {"molname": ["H2"], "basis": ["STO-3G"], "bondlength": ["0.5"]})
[("H2_STO-3G_0.5", "https://cloud.pennylane.ai/datasets/h5/qchem/h2/sto-3g/0.5.h5")]

## `list_data_names`

```python
def list_data_names() -> list[str]
```

Get list of dataclass IDs.

## `list_attributes`

```python
def list_attributes(data_name) -> list[str]
```

List the attributes that exist for a specific ``data_name``.

Args:
    data_name (str): The type of the desired data

Returns:
    list (str): A list of accepted attributes for a given data name

.. seealso:: :func:`~.load_interactive`, :func:`~.list_data_names`, :func:`~.load`.

**Example**

>>> qp.data.list_attributes(data_name="qchem")
['basis_rot_groupings',
 'basis_rot_samples',
 'dipole_op',
 ...
 'vqe_gates',
 'vqe_params']
