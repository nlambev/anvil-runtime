
from anvil.util import WrappedObject, WrappedList
from anvil.server import serializable_type


@serializable_type
class Tickfont(WrappedObject):
    _name = "Tickfont"
    _module = "plotly.graph_objs.layout.polar.radialaxis"

@serializable_type
class Tickformatstop(WrappedObject):
    _name = "Tickformatstop"
    _module = "plotly.graph_objs.layout.polar.radialaxis"

@serializable_type
class Title(WrappedObject):
    _name = "Title"
    _module = "plotly.graph_objs.layout.polar.radialaxis"


__all__ = [
    'Tickfont',
    'Tickformatstop',
    'Title',
    'title',
]

from plotly.graph_objs.layout.polar.radialaxis import title
