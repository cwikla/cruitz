class ValidPhoneNumberValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    value = value.strip.scan(/\d/).join if !value.blank?

    unless value =~ /\A(1\-?)?(\d{3}\-?)?(\d{3})\-?\d{4}\z/
      record.errors[attribute] << (options[:message] || "is not a valid")
    end
  end
end
