module Filters
  extend ActiveSupport::Concern

  module ClassMethods
    def filtering_params(params)
      results = self.all
      params.each do |key, value|
        results = results.public_send(key, value) if value.present?
      end
      results
    end
  end
end