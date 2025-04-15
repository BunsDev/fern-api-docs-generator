# frozen_string_literal: true

module Imdb
  module Framework
    module Types
      class Model
        # Definition of a field on a model
        class Field
          attr_reader :name, :type, :required

          def initialize(name:, type:, required: false)
            @name = name
            @type = type
            @required = required
          end
        end
      end
    end
  end
end
