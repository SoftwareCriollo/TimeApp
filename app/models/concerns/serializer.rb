module Serializer
  def arrays_object(array,attrs)
    attrs = attrs.map(&:to_sym)
    array.map do |item|
      attributes = item.attributes.delete_if do |key,value|
        !attrs.include?(key.to_sym)
      end
      attributes.symbolize_keys
    end
  end
end