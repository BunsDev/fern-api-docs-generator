# frozen_string_literal: true

module Imdb
  module Framework
    module Types
      # @abstract
      #
      # An abstract model that all data objects will inherit from
      class Model
        extend Types

        class << self
          def fields
            @fields ||= {}
          end

          # Define a new field on this model
          #
          # @param name [Symbol]
          # @param type [Class]
          # @option required [Boolean]
          # @return [void]
          def field(name, type, required: false)
            add_field_definition(name: name, type: type, required: required)
          end

          # Adds a new field definition into the class's registry
          #
          # @api private
          #
          # @param name [Symbol]
          # @param type [Class]
          # @option required [Boolean]
          # @option optional [Boolean]
          # @return [void]
          private def add_field_definition(name:, type:, required:)
            fields[name.to_sym] = Field.new(name: name, type: type, required: required)

            define_method("#{name}=".to_sym) do |val|
              @data[name] = val
            end

            define_method(name.to_sym) do
              @data[name]
            end
          end
        end

        # Creates a new instance of this model
        #
        # @param values [Hash]
        # @return [self]
        def initialize(values = {})
          @data = {}

          self.class.fields.each_key do |field_name|
            @data[field_name] = values.fetch(field_name, nil)
          end
        end

        # @return [String]
        def inspect
          fields = self.class.fields.keys.map do |name|
            value = send(name.to_sym)

            "#{name}=#{value.inspect}"
          end

          "#<#{self.class.name}:0x#{object_id.to_s(16)} #{fields.join(" ")}>"
        end
      end
    end
  end
end
