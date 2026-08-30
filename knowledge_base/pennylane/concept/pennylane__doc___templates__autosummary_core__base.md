---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/_templates/autosummary_core/base.rst
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/_templates/autosummary_core/base.rst
license: Apache-2.0
---

{% if referencefile %}
.. include:: {{ referencefile }}
{% endif %}

{% if module.split(".")[1:] | length >= 1 %}
	{% set mod = module.split(".")[1:] | join(".") %}
	{% set mod = "qp." + mod %}
{% else %}
	{% set mod = "qp" %}
{% endif %}

{{ mod }}.{{ objname }}
={% for i in range(mod|length) %}={% endfor %}{{ underline }}

.. currentmodule:: {{ module }}

.. auto{{ objtype }}:: {{ objname }}
