class GenCompanies < ActiveRecord::Migration[5.1]
  def up
    Company.reset_column_information

    User.find_each do |u|
      u.create_company if u.company.nil?
    end

  end

  def down
    # nothing
  end
end
