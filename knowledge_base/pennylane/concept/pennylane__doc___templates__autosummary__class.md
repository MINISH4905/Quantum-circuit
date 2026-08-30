---
framework: pennylane
api_version: v0.45.1
doc_type: concept
source_path: doc/_templates/autosummary/class.rst
source_url: https://github.com/PennyLaneAI/pennylane/blob/5f61ce25df3cc28a1ac785d20e47d70761202ed2/doc/_templates/autosummary/class.rst
license: Apache-2.0
---

{{ fullname | replace("pennylane", "qp") }}
{{ underline }}

.. autoclass:: {{ fullname }}
   :show-inheritance:

   {% if '__init__' in methods %}
     {% set caught_result = methods.remove('__init__') %}
   {% endif %}

   {% block attributes_documentation %}
   {% if attributes %}

   .. raw:: html

      <a class="attr-details-header collapse-header" data-toggle="collapse" href="#attrDetails" aria-expanded="false" aria-controls="attrDetails">
         <h2 style="font-size: 24px;">
            <i class="fas fa-angle-down rotate" style="float: right;"></i> Attributes
         </h2>
      </a>
      <div class="collapse" id="attrDetails">

   {% block attributes_summary %}
   {% if attributes %}

   .. autosummary::
      :nosignatures:
   {% for item in attributes %}
      ~{{ name }}.{{ item }}
   {%- endfor %}

   {% endif %}
   {% endblock %}

   {% for item in attributes %}
   .. autoattribute:: {{ item }}
   {%- endfor %}

   .. raw:: html

      </div>

   {% endif %}
   {% endblock %}

   {% block methods_documentation %}
   {% if methods %}

   .. raw:: html

      <a class="meth-details-header collapse-header" data-toggle="collapse" href="#methDetails" aria-expanded="false" aria-controls="methDetails">
         <h2 style="font-size: 24px;">
            <i class="fas fa-angle-down rotate" style="float: right;"></i> Methods
         </h2>
      </a>
      <div class="collapse" id="methDetails">

   {% block methods_summary %}
   {% if methods %}

   .. autosummary::
   {% for item in methods %}
      ~{{ name }}.{{ item }}
   {%- endfor %}

   {% endif %}
   {% endblock %}

   {% for item in methods %}
   .. automethod:: {{ item }}
   {%- endfor %}

   .. raw:: html

      </div>

   {% endif %}
   {% endblock %}

   .. raw:: html

      <script type="text/javascript">
         $(".collapse-header").click(function () {
             $(this).children('h2').eq(0).children('i').eq(0).toggleClass("up");
         })
      </script>
