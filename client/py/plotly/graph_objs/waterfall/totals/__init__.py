
from anvil.util import WrappedObject, WrappedList
from anvil.server import serializable_type


@serializable_type
class Marker(WrappedObject):
    _name = "Marker"
    _module = "plotly.graph_objs.waterfall.totals"


__all__ = [
    'Marker',
    'marker',
]

from plotly.graph_objs.waterfall.totals import marker
