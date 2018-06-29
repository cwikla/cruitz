class ValidEmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A[^@\s]+@([^@\s]+\.)+[^@\s]+\z/
      record.errors[attribute] << (options[:message] || "is not correctly formatted")
    end
  end
end
