---
framework: pennylane
api_version: v0.45.1
doc_type: api
source_path: pennylane/data/data_manager/__init__.py
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/pennylane/data/data_manager/__init__.py
license: Apache-2.0
---

## Module `pennylane/data/data_manager/__init__.py`

Contains functions for querying available datasets and downloading
them.

## `load`

```python
def load(data_name: str, attributes: Iterable[str] | None=None, folder_path: Path=Path('./datasets/'), force: bool=False, num_threads: int=50, block_size: int=8388608, progress_bar: bool | None=None, **params: ParamArg | str | list[str])
```

Downloads the data if it is not already present in the directory and returns it as a list of
:class:`~pennylane.data.Dataset` objects. For the full list of available datasets, please see
the `datasets website <https://pennylane.ai/datasets>`_.

Args:
    data_name (str)   : A string representing the type of data required such as `qchem`, `qpsin`, etc.
    attributes (list[str]) : An optional list to specify individual data element that are required
    folder_path (str) : Path to the directory used for saving datasets. Defaults to './datasets'
    force (Bool)      : Bool representing whether data has to be downloaded even if it is still present
    num_threads (int) : The maximum number of threads to spawn while downloading files (1 thread per file)
    block_size (int)  : The number of bytes to fetch per read operation when fetching datasets from S3.
        Larger values may improve performance for large datasets, but will slow down small reads. Defaults
        to 8MB
    progress_bar (bool) : Whether to show a progress bars for downloads. Defaults to True if running
        in an interactive terminal, False otherwise.
    params (kwargs)   : Keyword arguments exactly matching the parameters required for the data type.
        Note that these are not optional

Returns:
    list[:class:`~pennylane.data.Dataset`]

.. seealso:: :func:`~.load_interactive`, :func:`~.list_attributes`, :func:`~.list_data_names`.

**Example**

The :func:`~pennylane.data.load` function returns a ``list`` with the desired data.

>>> H2datasets = qp.data.load("qchem", molname="H2", basis="STO-3G", bondlength=1.1)
>>> print(H2datasets)
[<Dataset = molname: H2, basis: STO-3G, bondlength: 1.1, attributes: ['basis', 'basis_rot_groupings', ...]>]

.. note::

    If not otherwise specified, ``qp.data.load`` will download the
    default parameter value specified by the dataset.

    The default values for attributes are as follows:

    - Molecules: ``basis`` is the smallest available basis, usually ``"STO-3G"``, and ``bondlength`` is the optimal bondlength for the molecule or an alternative if the optimal is not known.

    - Spin systems: ``periodicity`` is ``"open"``, ``lattice`` is ``"chain"``, and ``layout`` is ``1x4`` for ``chain`` systems and ``2x2`` for ``rectangular`` systems.

We can load datasets for multiple parameter values by providing a list of values instead of a single value.
To load all possible values, use the special value :const:`~pennylane.data.FULL` or the string 'full':

>>> H2datasets = qp.data.load("qchem", molname="H2", basis="full", bondlength=[0.5, 1.1])
>>> print(H2datasets)
[<Dataset = molname: H2, basis: STO-3G, bondlength: 0.5, attributes: ['basis', 'basis_rot_groupings', ...]>,
    <Dataset = molname: H2, basis: STO-3G, bondlength: 1.1, attributes: ['basis', 'basis_rot_groupings', ...]>,
    <Dataset = molname: H2, basis: CC-PVDZ, bondlength: 0.5, attributes: ['basis', 'basis_rot_groupings', ...]>,
    <Dataset = molname: H2, basis: CC-PVDZ, bondlength: 1.1, attributes: ['basis', 'basis_rot_groupings', ...]>,
    <Dataset = molname: H2, basis: 6-31G, bondlength: 0.5, attributes: ['basis', 'basis_rot_groupings', ...]>,
    <Dataset = molname: H2, basis: 6-31G, bondlength: 1.1, attributes: ['basis', 'basis_rot_groupings', ...]>]

When we only want to download portions of a large dataset, we can specify
the desired properties  (referred to as 'attributes'). For example, we
can download or load only the molecule and energy of a dataset as
follows:

>>> part = qp.data.load(
...     "qchem",
...     molname="H2",
...     basis="STO-3G",
...     bondlength=1.1,
...     attributes=["molecule", "fci_energy"])[0]
>>> part.molecule
<Molecule = H2, Charge: 0, Basis: STO-3G, Orbitals: 2, Electrons: 2>

To determine what attributes are available, please see :func:`~.list_attributes`.

The loaded data items are fully compatible with PennyLane. We can
therefore use them directly in a PennyLane circuit as follows:

>>> H2data = qp.data.load("qchem", molname="H2", basis="STO-3G", bondlength=1.1)[0]
>>> dev = qp.device("default.qubit",wires=4)
>>> @qp.qnode(dev)
... def circuit():
...     qp.BasisState(H2data.hf_state, wires = [0, 1, 2, 3])
...     for op in H2data.vqe_gates:
...         qp.apply(op)
...     return qp.expval(H2data.hamiltonian)
>>> print(circuit())
-1.0791430411076344

## `list_datasets`

```python
def list_datasets() -> dict
```

Returns a dictionary of the available datasets.

Return:
    dict: Nested dictionary representing the directory structure of the hosted datasets.

.. seealso:: :func:`~.load_interactive`, :func:`~.list_attributes`, :func:`~.load`.

**Example:**

Note that the results of calling this function may differ from this example as more datasets
are added. For updates on available data see the `datasets website <https://pennylane.ai/datasets>`_.

>>> available_data = qp.data.list_datasets()
>>> available_data.keys()
dict_keys(["qspin", "qchem"])
>>> available_data["qchem"].keys()
dict_keys(["H2", "LiH", ...])
>>> available_data['qchem']['H2'].keys()
dict_keys(["CC-PVDZ", "6-31G", "STO-3G"])
>>> print(available_data['qchem']['H2']['STO-3G'])
["0.5", "0.54", "0.62", "0.66", ...]

Note that this example limits the results of the function calls for
clarity and that as more data becomes available, the results of these
function calls will change.

## `load_interactive`

```python
def load_interactive()
```

Download a dataset using an interactive load prompt.

Returns:
    :class:`~pennylane.data.Dataset`

**Example**

.. seealso:: :func:`~.load`, :func:`~.list_attributes`, :func:`~.list_data_names`.

.. code-block :: pycon

    >>> qp.data.load_interactive()
    Please select the data name from the following:
        1: qspin
        2: qchem
        3: other
    Choice [1-2]: 1
    Please select a sysname:
        ...
    Please select a periodicity:
        ...
    Please select a lattice:
        ...
    Please select a layout:
        ...
    Please select attributes:
        ...
    Force download files? (Default is no) [y/N]: N
    Folder to download to? (Default is pwd, will download to /datasets subdirectory):

    Please confirm your choices:
    dataset: qspin/Ising/open/rectangular/4x4
    attributes: ['parameters', 'ground_states']
    force: False
    dest folder: /Users/jovyan/Downloads/datasets
    Would you like to continue? (Default is yes) [Y/n]:
