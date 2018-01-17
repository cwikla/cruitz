class FixCompanyLogo < ActiveRecord::Migration[5.1]
  def up
    remove_column :companies, :logo
    remove_column :companies, :logo_url
    remove_column :companies, :logo_uploaded_at
    remove_column :companies, :logo_data

    add_column :companies, :pyr_upload_id, :integer

    add_index :companies, :pyr_upload_id
  end

  def down
    remove_column :companies, :pyr_upload_id

    add_column :companies, :logo, :string
    add_column :companies, :logo_url, :string
    add_column :companies, :logo_uploaded_at, :string
    add_column :companies, :logo_data, :string
  end

end
