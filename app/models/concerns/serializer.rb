module Serializer
  def arrays_object(array,attrs)
    array.map do |item|
      item.attributes.delete_if{ |key,value| !attrs.include?(key) }
    end
  end
end